import React, { createContext, useContext, useState, type ReactNode } from 'react';
import './Accordion.css';

// 1. Accordion Context định nghĩa trạng thái panel nào đang mở trong Accordion
interface AccordionContextType {
  activeId: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion sub-components must be rendered within an <Accordion> provider.');
  }
  return context;
}

// 2. Accordion Item Context định nghĩa ID của Item hiện tại
interface AccordionItemContextType {
  id: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Header and Accordion.Content must be rendered within an <Accordion.Item>.');
  }
  return context;
}

export interface AccordionProps {
  children: ReactNode;
  defaultOpenId?: string | null;
  className?: string;
}

/**
 * Accordion Compound Component
 * Đảm bảo tại một thời điểm chỉ mở tối đa 1 panel (single panel mode).
 */
export function Accordion({ children, defaultOpenId = null, className = '' }: AccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultOpenId);

  const toggleItem = (id: string) => {
    setActiveId((prevActiveId) => (prevActiveId === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem }}>
      <div className={`accordion-container ${className}`.trim()}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ id, children, className = '' }: AccordionItemProps) {
  const { activeId } = useAccordionContext();
  const isOpen = activeId === id;

  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className={`accordion-item ${isOpen ? 'is-open' : ''} ${className}`.trim()}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function AccordionHeader({ children, className = '', icon }: AccordionHeaderProps) {
  const { activeId, toggleItem } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeId === id;

  const handleClick = () => {
    toggleItem(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  return (
    <div className={`accordion-header ${className}`.trim()}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        id={`accordion-header-${id}`}
      >
        <span className="accordion-title">{children}</span>
        <span className={`accordion-icon ${isOpen ? 'rotate' : ''}`}>
          {icon || (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const { activeId } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeId === id;

  return (
    <div
      id={`accordion-panel-${id}`}
      role="region"
      aria-labelledby={`accordion-header-${id}`}
      hidden={!isOpen}
      className={`accordion-content ${isOpen ? 'is-visible' : 'is-hidden'} ${className}`.trim()}
    >
      <div className="accordion-content-inner">{children}</div>
    </div>
  );
}

// Gắn sub-components dạng Compound Pattern
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
