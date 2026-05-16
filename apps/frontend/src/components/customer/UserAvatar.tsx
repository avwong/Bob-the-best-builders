'use client';

import React from 'react';

interface UserAvatarProps {
    x: number;
    y: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ x, y, direction = 'down' }) => {
    // Position directly in SVG coordinate space (meters)
    const centerX = x;
    const centerY = y;
    const size = 1.2; // 1.2 meters visual radius

    // Rotation based on direction
    const rotations = {
        up: 0,
        right: 90,
        down: 180,
        left: 270,
    };

    return (
        <g
            transform={`translate(${centerX}, ${centerY})`}
        >
            {/* Outer pulse ring */}
            <circle
                cx="0"
                cy="0"
                r={size * 0.6}
                fill="none"
                stroke="#10b981"
                strokeWidth={0.08}
                opacity={0.4}
            >
                <animate
                    attributeName="r"
                    from={size * 0.4}
                    to={size * 0.8}
                    dur="2s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Shadow */}
            <ellipse
                cx="0"
                cy={size * 0.15}
                rx={size * 0.25}
                ry={size * 0.08}
                fill="rgba(0, 0, 0, 0.15)"
            />

            {/* User dot */}
            <g transform={`rotate(${rotations[direction]})`}>
                {/* Main circle */}
                <circle
                    cx="0"
                    cy="0"
                    r={size * 0.3}
                    fill="#10b981"
                    stroke="#fff"
                    strokeWidth={0.1}
                />

                {/* Direction indicator (arrow) */}
                <path
                    d={`M 0,${-size * 0.38} L ${size * 0.12},${-size * 0.25} L ${-size * 0.12},${-size * 0.25} Z`}
                    fill="#fff"
                />
            </g>
        </g>
    );
};

// Made with Bob
