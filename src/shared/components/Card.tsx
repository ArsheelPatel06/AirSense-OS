import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <motion.div
      className={twMerge(
        clsx(
          'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5',
          'backdrop-blur-xl shadow-lg',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
