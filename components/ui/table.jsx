'use client';

import React from 'react';
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Table({ columns, data, onRowClick }) {
  return (
    <ShadcnTable>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className="text-left font-medium text-gray-900">
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow 
            key={rowIndex} 
            onClick={() => onRowClick && onRowClick(row)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns.map((column, cellIndex) => (
              <TableCell key={cellIndex} className="text-gray-600">
                {column.cell ? column.cell(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadcnTable>
  );
}