'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Locate, ZoomIn, ZoomOut } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { ShoppingListItem, UserPosition } from '@/types/customer';
import { Shelf, Freezer, SpecialZone, Checkout, EntryExit, Wall } from '@/types/supermarket';

interface SupermarketMapProps {
    storeWidth: number;
    storeHeight: number;
    gridSize: number;
    shelves: Shelf[];
    freezers: Freezer[];
    specialZones: SpecialZone[];
    checkouts: Checkout[];
    entryExit: EntryExit[];
    walls: Wall[];
    userPosition: UserPosition;
    shoppingListItems: ShoppingListItem[];
    highlightedItem?: ShoppingListItem | null;
}

export const SupermarketMap: React.FC<SupermarketMapProps> = ({
    storeWidth,
    storeHeight,
    gridSize,
    shelves,
    freezers,
    specialZones,
    checkouts,
    entryExit,
    walls,
    userPosition,
    shoppingListItems,
    highlightedItem,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [zoom, setZoom] = useState(1);
    const [viewOrigin, setViewOrigin] = useState({ x: -2, y: -2 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);

    const padding = 2;
    const viewWidth = (storeWidth + padding * 2) / zoom;
    const viewHeight = (storeHeight + padding * 2) / zoom;
    const viewBox = `${viewOrigin.x} ${viewOrigin.y} ${viewWidth} ${viewHeight}`;

    // Convert screen coordinates to SVG coordinates
    const getSVGPoint = useCallback((clientX: number, clientY: number) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };
        const svgP = pt.matrixTransform(ctm.inverse());
        return { x: svgP.x, y: svgP.y };
    }, []);

    // Center on user position
    const centerOnUser = useCallback(() => {
        setViewOrigin({
            x: userPosition.x - viewWidth / 2,
            y: userPosition.y - viewHeight / 2,
        });
    }, [userPosition, viewWidth, viewHeight]);

    // Zoom controls
    const handleZoomIn = () => {
        const newZoom = Math.min(3, zoom + 0.2);
        setZoom(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(0.5, zoom - 0.2);
        setZoom(newZoom);
    };

    // Mouse wheel zoom
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Math.max(0.5, Math.min(3, zoom + delta));

            if (svgRef.current) {
                const mousePos = getSVGPoint(e.clientX, e.clientY);
                const zoomRatio = newZoom / zoom;
                setViewOrigin((prev) => ({
                    x: mousePos.x - (mousePos.x - prev.x) / zoomRatio,
                    y: mousePos.y - (mousePos.y - prev.y) / zoomRatio,
                }));
            }

            setZoom(newZoom);
        },
        [zoom, getSVGPoint]
    );

    useEffect(() => {
        const svgEl = svgRef.current;
        if (!svgEl) return;
        svgEl.addEventListener('wheel', handleWheel, { passive: false });
        return () => svgEl.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Touch handling for pinch zoom and pan
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            setTouchStartDistance(distance);
        } else if (e.touches.length === 1) {
            const touch = e.touches[0];
            const svgPoint = getSVGPoint(touch.clientX, touch.clientY);
            setIsPanning(true);
            setPanStart(svgPoint);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && touchStartDistance !== null) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            const scale = distance / touchStartDistance;
            const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
            setZoom(newZoom);
            setTouchStartDistance(distance);
        } else if (e.touches.length === 1 && isPanning) {
            const touch = e.touches[0];
            const currentPoint = getSVGPoint(touch.clientX, touch.clientY);
            const dx = currentPoint.x - panStart.x;
            const dy = currentPoint.y - panStart.y;
            setViewOrigin((prev) => ({
                x: prev.x - dx,
                y: prev.y - dy,
            }));
        }
    };

    const handleTouchEnd = () => {
        setIsPanning(false);
        setTouchStartDistance(null);
    };

    // Mouse pan
    const handleMouseDown = (e: React.MouseEvent) => {
        const svgPoint = getSVGPoint(e.clientX, e.clientY);
        setIsPanning(true);
        setPanStart(svgPoint);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isPanning) {
                const currentPoint = getSVGPoint(e.clientX, e.clientY);
                const dx = currentPoint.x - panStart.x;
                const dy = currentPoint.y - panStart.y;
                setViewOrigin((prev) => ({
                    x: prev.x - dx,
                    y: prev.y - dy,
                }));
            }
        },
        [isPanning, panStart, getSVGPoint]
    );

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        if (isPanning) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isPanning, handleMouseMove, handleMouseUp]);

    // Render functions
    const renderShelf = (shelf: Shelf) => (
        <g key={shelf.id}>
            <rect
                x={shelf.position.x}
                y={shelf.position.y}
                width={shelf.dimensions.width}
                height={shelf.dimensions.height}
                fill="#8b5e3c"
                stroke="#6b4226"
                strokeWidth={0.08}
                rx={0.1}
            />
            <text
                x={shelf.position.x + shelf.dimensions.width / 2}
                y={shelf.position.y + shelf.dimensions.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.min(shelf.dimensions.width, shelf.dimensions.height) * 0.4}
                fontWeight="bold"
                fill="#fff"
                pointerEvents="none"
            >
                {shelf.label}
            </text>
        </g>
    );

    const renderFreezer = (freezer: Freezer) => (
        <g key={freezer.id}>
            <rect
                x={freezer.position.x}
                y={freezer.position.y}
                width={freezer.dimensions.width}
                height={freezer.dimensions.height}
                fill="#0ea5e9"
                stroke="#0369a1"
                strokeWidth={0.08}
                rx={0.15}
            />
            {/* Frost lines */}
            <line
                x1={freezer.position.x + freezer.dimensions.width * 0.2}
                y1={freezer.position.y + freezer.dimensions.height * 0.35}
                x2={freezer.position.x + freezer.dimensions.width * 0.8}
                y2={freezer.position.y + freezer.dimensions.height * 0.35}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={0.06}
            />
            <line
                x1={freezer.position.x + freezer.dimensions.width * 0.2}
                y1={freezer.position.y + freezer.dimensions.height * 0.65}
                x2={freezer.position.x + freezer.dimensions.width * 0.8}
                y2={freezer.position.y + freezer.dimensions.height * 0.65}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={0.06}
            />
            <text
                x={freezer.position.x + freezer.dimensions.width / 2}
                y={freezer.position.y + freezer.dimensions.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.min(freezer.dimensions.width, freezer.dimensions.height) * 0.35}
                fontWeight="bold"
                fill="#fff"
                pointerEvents="none"
            >
                ❄️
            </text>
        </g>
    );

    const renderSpecialZone = (zone: SpecialZone) => {
        const zoneColors: Record<string, { fill: string; stroke: string }> = {
            produce_section: { fill: '#d1fae5', stroke: '#10b981' },
            deli_section: { fill: '#fef3c7', stroke: '#f59e0b' },
            bakery_section: { fill: '#fce7f3', stroke: '#ec4899' },
            pharmacy_section: { fill: '#dbeafe', stroke: '#3b82f6' },
        };
        const colors = zoneColors[zone.type] || { fill: '#f3f4f6', stroke: '#9ca3af' };

        return (
            <g key={zone.id}>
                <rect
                    x={zone.position.x}
                    y={zone.position.y}
                    width={zone.dimensions.width}
                    height={zone.dimensions.height}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={0.08}
                    rx={0.15}
                    strokeDasharray="0.3 0.15"
                />
                <text
                    x={zone.position.x + zone.dimensions.width / 2}
                    y={zone.position.y + zone.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(zone.dimensions.width, zone.dimensions.height) * 0.25}
                    fontWeight="600"
                    fill="#374151"
                    pointerEvents="none"
                >
                    {zone.label}
                </text>
            </g>
        );
    };

    const renderCheckout = (checkout: Checkout) => (
        <g key={checkout.id}>
            <rect
                x={checkout.position.x}
                y={checkout.position.y}
                width={checkout.dimensions.width}
                height={checkout.dimensions.height}
                fill="#bfdbfe"
                stroke="#60a5fa"
                strokeWidth={0.08}
                rx={0.1}
            />
            <text
                x={checkout.position.x + checkout.dimensions.width / 2}
                y={checkout.position.y + checkout.dimensions.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.min(checkout.dimensions.width, checkout.dimensions.height) * 0.5}
                fontWeight="600"
                fill="#374151"
                pointerEvents="none"
            >
                $
            </text>
        </g>
    );

    const renderEntryExit = (point: EntryExit) => {
        const color = point.type === 'entrance' ? '#d1fae5' : '#fecaca';
        const strokeColor = point.type === 'entrance' ? '#10b981' : '#ef4444';

        return (
            <g key={point.id}>
                <rect
                    x={point.position.x}
                    y={point.position.y}
                    width={point.dimensions.width}
                    height={point.dimensions.height}
                    fill={color}
                    stroke={strokeColor}
                    strokeWidth={0.08}
                    rx={0.1}
                />
                <text
                    x={point.position.x + point.dimensions.width / 2}
                    y={point.position.y + point.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(point.dimensions.width, point.dimensions.height) * 0.5}
                    fontWeight="600"
                    fill="#374151"
                    pointerEvents="none"
                >
                    {point.type === 'entrance' ? 'IN' : 'OUT'}
                </text>
            </g>
        );
    };

    const renderWall = (wall: Wall) => (
        <g key={wall.id}>
            <rect
                x={wall.position.x}
                y={wall.position.y}
                width={wall.dimensions.width}
                height={wall.dimensions.height}
                fill="#6b7280"
                stroke="#374151"
                strokeWidth={0.1}
                rx={0.05}
            />
        </g>
    );

    const renderProductMarkers = () => {
        return shoppingListItems
            .filter((item) => item.location && !item.checked)
            .map((item) => {
                const isHighlighted = highlightedItem?.id === item.id;
                return (
                    <g key={item.id}>
                        {/* Glow effect for highlighted */}
                        {isHighlighted && (
                            <circle
                                cx={item.location!.x + 0.5}
                                cy={item.location!.y + 0.5}
                                r={1}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth={0.1}
                                opacity={0.5}
                            >
                                <animate
                                    attributeName="r"
                                    from="0.6"
                                    to="1.2"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    from="0.5"
                                    to="0"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        )}
                        <circle
                            cx={item.location!.x + 0.5}
                            cy={item.location!.y + 0.5}
                            r={isHighlighted ? 0.6 : 0.4}
                            fill={isHighlighted ? '#f59e0b' : '#10b981'}
                            stroke="#fff"
                            strokeWidth={0.12}
                            opacity={0.95}
                        />
                        <text
                            x={item.location!.x + 0.5}
                            y={item.location!.y + 0.5}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={0.32}
                            fontWeight="bold"
                            fill="#fff"
                            pointerEvents="none"
                        >
                            {item.quantity}
                        </text>
                    </g>
                );
            });
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-100">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="block touch-none"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
                {/* Background */}
                <rect
                    x={viewOrigin.x - 100}
                    y={viewOrigin.y - 100}
                    width={viewWidth + 200}
                    height={viewHeight + 200}
                    fill="#f1f5f9"
                />

                {/* Store boundary */}
                <rect
                    x={0}
                    y={0}
                    width={storeWidth}
                    height={storeHeight}
                    fill="#ffffff"
                    stroke="#94a3b8"
                    strokeWidth={0.15}
                    rx={0.3}
                />

                {/* Store elements - Order matters! First = Behind, Last = Front */}

                {/* Layer 1: Background elements (furthest back) */}
                {specialZones.map(renderSpecialZone)}

                {/* Layer 2: Walls */}
                {walls.map(renderWall)}

                {/* Layer 3: Main store fixtures */}
                {shelves.map(renderShelf)}
                {freezers.map(renderFreezer)}
                {checkouts.map(renderCheckout)}
                {entryExit.map(renderEntryExit)}

                {/* Layer 4: Product markers */}
                {renderProductMarkers()}

                {/* Layer 5: User avatar (always on top) */}
                <UserAvatar x={userPosition.x} y={userPosition.y} />
            </svg>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
                >
                    <ZoomIn className="h-5 w-5 text-gray-700" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
                >
                    <ZoomOut className="h-5 w-5 text-gray-700" />
                </button>
                <button
                    onClick={centerOnUser}
                    className="bg-emerald-500 shadow-lg rounded-lg p-2 hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
                >
                    <Locate className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg text-xs border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-700">Products in list</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-sky-500" />
                    <span className="text-gray-700">Freezers</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                    <span className="text-gray-700">Your location</span>
                </div>
            </div>
        </div>
    );
};

// Made with Bob
