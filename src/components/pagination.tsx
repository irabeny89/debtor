import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.arrowButton, currentPage === 1 && styles.disabledArrow]} 
        onPress={handlePrev}
        disabled={currentPage === 1}
      >
        <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#9CA3AF" : "#4F46E5"} />
      </TouchableOpacity>

      <View style={styles.pageNumbersContainer}>
        {pages.map(page => (
          <TouchableOpacity
            key={page}
            style={[styles.pageButton, currentPage === page && styles.activePageButton]}
            onPress={() => onPageChange(page)}
          >
            <Text style={[styles.pageText, currentPage === page && styles.activePageText]}>
              {page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.arrowButton, currentPage === totalPages && styles.disabledArrow]} 
        onPress={handleNext}
        disabled={currentPage === totalPages}
      >
        <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#9CA3AF" : "#4F46E5"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledArrow: {
    backgroundColor: '#F3F4F6',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activePageButton: {
    backgroundColor: '#4F46E5',
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  activePageText: {
    color: '#FFFFFF',
  },
});
