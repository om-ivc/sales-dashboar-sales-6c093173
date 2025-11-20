import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CardComponent({ title, description, children, footer, className = '', ...props }) {
  return (
    <Card className={`shadow-sm rounded-lg overflow-hidden ${className}`} {...props}>
      <CardHeader className="border-b border-gray-200">
        {title && <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>}
        {description && <CardDescription className="text-sm text-gray-600 mt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export default CardComponent;