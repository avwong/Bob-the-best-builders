import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

const product = {
  id: 'product-1',
  name: 'Lasagna Sheets 500g',
  barcode: '123',
  category: 'Pasta',
  supermarketId: 'store-1',
  aisleId: 'aisle-5',
  aisleNumber: 5,
  aisleSegment: 'A',
  shelfSide: 'left',
  shelfSection: 'middle',
  gridX: 30,
  gridY: 9,
  price: { toString: () => '3.49' },
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductsService', () => {
  it('updates an existing product', async () => {
    const prisma = {
      product: {
        findUnique: jest.fn().mockResolvedValue({ id: product.id }),
        update: jest.fn().mockResolvedValue({ ...product, name: 'Lasagna Sheets' }),
      },
    };

    const service = new ProductsService(prisma as any);
    const result = await service.update(product.id, { name: 'Lasagna Sheets' });

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: product.id },
      data: expect.objectContaining({ name: 'Lasagna Sheets' }),
    });
    expect(result.name).toBe('Lasagna Sheets');
  });

  it('throws when deleting a missing product', async () => {
    const prisma = {
      product: {
        findUnique: jest.fn().mockResolvedValue(null),
        delete: jest.fn(),
      },
    };

    const service = new ProductsService(prisma as any);

    await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.product.delete).not.toHaveBeenCalled();
  });
});
