// import { act, renderHook } from '@testing-library/react-hooks'
// import { useStore } from '../useStore'

// describe('useStore', () => {
//   beforeEach(() => {
//     const { result } = renderHook(() => useStore())
//     act(() => {
//       result.current.lists = []
//     })
//   })

//   it('should add a new list', () => {
//     const { result } = renderHook(() => useStore())

//     act(() => {
//       result.current.addList('Test List')
//     })

//     expect(result.current.lists).toHaveLength(1)
//     expect(result.current.lists[0].title).toBe('Test List')
//     expect(result.current.lists[0].items).toHaveLength(0)
//   })

//   it('should add items to a list', () => {
//     const { result } = renderHook(() => useStore())

//     act(() => {
//       result.current.addList('Test List')
//       result.current.addItem('test-list', 'Test Item')
//     })

//     expect(result.current.lists[0].items).toHaveLength(1)
//     expect(result.current.lists[0].items[0].message).toBe('Test Item')
//     expect(result.current.lists[0].items[0].done).toBe(false)
//   })

//   it('should update item status', () => {
//     const { result } = renderHook(() => useStore())

//     act(() => {
//       result.current.addList('Test List')
//       result.current.addItem('test-list', 'Test Item')
//       result.current.updateItem(
//         'test-list',
//         result.current.lists[0].items[0].id,
//         { done: true },
//       )
//     })

//     expect(result.current.lists[0].items[0].done).toBe(true)
//   })

//   it('should delete a list', () => {
//     const { result } = renderHook(() => useStore())

//     act(() => {
//       result.current.addList('Test List')
//       result.current.deleteList('test-list')
//     })

//     expect(result.current.lists).toHaveLength(0)
//   })

//   it('should delete an item', () => {
//     const { result } = renderHook(() => useStore())

//     act(() => {
//       result.current.addList('Test List')
//       result.current.addItem('test-list', 'Test Item')
//       result.current.deleteItem(
//         'test-list',
//         result.current.lists[0].items[0].id,
//       )
//     })

//     expect(result.current.lists[0].items).toHaveLength(0)
//   })

//   it('should import and export data', () => {
//     const { result } = renderHook(() => useStore())
//     const testData = {
//       lists: [
//         {
//           slug: 'test-list',
//           title: 'Test List',
//           items: [
//             {
//               id: '1',
//               message: 'Test Item',
//               done: false,
//               created_at: new Date(),
//             },
//           ],
//           created_at: new Date(),
//         },
//       ],
//     }

//     act(() => {
//       result.current.importData(testData)
//     })

//     expect(result.current.lists).toHaveLength(1)
//     expect(result.current.lists[0].title).toBe('Test List')
//     expect(result.current.lists[0].items).toHaveLength(1)

//     const exportedData = result.current.exportData()
//     expect(exportedData.lists).toHaveLength(1)
//     expect(exportedData.lists[0].title).toBe('Test List')
//   })
// })
