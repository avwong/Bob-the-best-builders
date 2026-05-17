import { SupermarketsService } from './supermarkets.service';

describe('SupermarketsService', () => {
  it('saves layout fixtures and returns the hydrated layout', async () => {
    const transaction = jest.fn(async (callback: any) =>
      callback({
        supermarket: { update: jest.fn() },
        aisle: { updateMany: jest.fn() },
        layoutElement: {
          deleteMany: jest.fn(),
          createMany: jest.fn(),
        },
      }),
    );

    const prisma = {
      supermarket: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce({ id: 'store-1' })
          .mockResolvedValueOnce({
            id: 'store-1',
            name: 'Aisly Market',
            width: 60,
            height: 40,
            createdAt: new Date(),
            updatedAt: new Date(),
            aisles: [],
            layoutElements: [
              {
                id: 'entrance',
                type: 'entrance',
                label: 'Entrance',
                category: null,
                positionX: 28,
                positionY: 1,
                width: 4,
                height: 2,
                orientation: 'horizontal',
                metadata: {},
              },
            ],
          }),
      },
      $transaction: transaction,
    };

    const service = new SupermarketsService(prisma as any);
    const result = await service.saveLayout('store-1', {
      name: 'Aisly Market',
      width: 60,
      height: 40,
      layoutElements: [
        {
          id: 'entrance',
          type: 'entrance',
          label: 'Entrance',
          positionX: 28,
          positionY: 1,
          width: 4,
          height: 2,
          orientation: 'horizontal',
          metadata: {},
        },
      ],
    });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(result.layoutElements).toHaveLength(1);
    expect(result.layoutElements[0]).toMatchObject({
      id: 'entrance',
      type: 'entrance',
      positionX: 28,
      positionY: 1,
    });
  });
});
