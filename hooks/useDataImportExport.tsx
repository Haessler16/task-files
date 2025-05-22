import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useStore } from '../store/useStore';

export const useDataImportExport = () => {
  const importData = useStore((state) => state.importData);
  const exportData = useStore((state) => state.exportData);

  const handleExport = async () => {
    try {
      const data = exportData();
      const jsonString = JSON.stringify(data, null, 2);
      const fileUri = `${FileSystem.cacheDirectory}task-lists.json`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      importData(data);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  return {
    handleExport,
    handleImport,
  };
};
