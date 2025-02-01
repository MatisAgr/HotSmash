import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Table({ data }) {
  if (!data || data.length === 0) {
    return <Text style={styles.noData}>Aucune donnée disponible</Text>;
  }

  const headers = Object.keys(data[0]);

  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {headers.map((header) => (
            <View style={styles.headerCell} key={header}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>
        {data.map((row, rowIndex) => (
          <View style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]} key={rowIndex}>
            {headers.map((header) => (
              <View style={styles.cell} key={header}>
                <Text style={styles.cellText}>{row[header]}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F9FAFB',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  cellText: {
    fontSize: 12,
    color: '#374151',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#374151',
  },
});