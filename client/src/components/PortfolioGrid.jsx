import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PortfolioTile from './PortfolioTile';
import PublicTile from './PublicTile';

// Wrapper component to provide Dnd Sortable features to individual tiles
function SortableTileWrapper({ item, isAdmin, onEdit, onDelete, onResize, onClickTile, onTogglePublish }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClasses = {
    small: 'tile-small',
    wide: 'tile-wide',
    tall: 'tile-tall',
    large: 'tile-large',
    banner: 'tile-banner',
    ultratall: 'tile-ultratall',
    full: 'tile-full'
  };
  const currentSizeClass = sizeClasses[item.size] || 'tile-small';

  return (
    <div 
      ref={setNodeRef} 
      style={dragStyles} 
      className={`relative ${currentSizeClass} ${isDragging ? 'z-30' : ''}`}
    >
      <PortfolioTile
        item={item}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onResize={onResize}
        onClickTile={onClickTile}
        onTogglePublish={onTogglePublish}
        dragHandleProps={isAdmin ? { ...attributes, ...listeners } : undefined}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function PortfolioGrid({ 
  items, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onResize, 
  onReorder,
  onClickTile,
  onTogglePublish
}) {
  const [visibleCount, setVisibleCount] = useState(12);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging a bit before activating so clicks are still registered
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    
    // Trigger callback with both new array and ID ordering
    onReorder(reorderedItems);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-cinema-border rounded-lg p-16 text-center">
        <p className="text-cinema-muted font-mono mb-2">[NO_ITEMS_FOUND]</p>
        <p className="text-sm text-cinema-muted">The portfolio is currently empty. Switch to Admin mode to add items.</p>
      </div>
    );
  }

  // In Admin Mode, wrap the grid in DndContext
  if (isAdmin) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="bento-grid">
            {items.map((item) => (
              <SortableTileWrapper
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
                onResize={onResize}
                onClickTile={onClickTile}
                onTogglePublish={onTogglePublish}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  // Public mode: masonry columns, every piece keeps its own shape (no cropping)
  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
        {items.slice(0, visibleCount).map((item, index) => (
          <PublicTile key={item.id} item={item} index={index} onClick={onClickTile} />
        ))}
      </div>
      {visibleCount < items.length && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setVisibleCount(n => n + 12)}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-800 hover:text-blue-700 font-semibold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer focus-ring"
          >
            Show more work <span className="text-slate-400 font-normal">({items.length - visibleCount} more)</span>
          </button>
        </div>
      )}
    </>
  );
}
