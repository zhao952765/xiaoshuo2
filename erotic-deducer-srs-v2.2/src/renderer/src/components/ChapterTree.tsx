import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProjectStore } from '../store/projectStore';

function SortableChapter({ chap, onUpdate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chap.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#272732] p-4 rounded-2xl flex items-center gap-4 cursor-grab active:cursor-grabbing group hover:ring-2 hover:ring-[#FF4D94]/30 transition-all"
    >
      <div className="text-[#FF4D94] font-mono w-8 text-lg font-bold">#{chap.number}</div>
      <input
            value={chap.title}
        onChange={e => onUpdate(chap.id, { title: e.target.value })}
        className="flex-1 bg-transparent focus:outline-none border-b border-transparent focus:border-[#FF4D94]/50 transition-all"
        onClick={(e) => e.stopPropagation()}
          />
      <div className="flex gap-4 text-xs text-gray-400">
        <span className="bg-[#FF4D94]/10 px-2 py-1 rounded">情:{chap.emotionProgress}%</span>
        <span className="bg-pink-500/10 px-2 py-1 rounded">欲:{chap.lustIntensity}★</span>
          </div>
      <button
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
        onClick={(e) => { e.stopPropagation(); onUpdate(chap.id, { _delete: true }); }}
      >
        删除
      </button>
      <div className="text-gray-600 text-xs">⠿</div>
    </div>
  );
}

export default function ChapterTree() {
  const { chapters, updateChapter } = useProjectStore();
  const [items, setItems] = useState(chapters);

  useEffect(() => {
    setItems(chapters);
  }, [chapters]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex(i => i.id === active.id);
      const newIndex = prev.findIndex(i => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const reordered = arrayMove(prev, oldIndex, newIndex);
      // 重新编号
      reordered.forEach((chap, idx) => {
        if (chap.number !== idx + 1) {
          updateChapter({ ...chap, number: idx + 1 });
        }
      });
      return reordered;
    });
  };

  const handleUpdate = (id: string, updates: any) => {
    if (updates._delete) {
      // 删除章节
      const { chapters: allChapters } = useProjectStore.getState();
      const remaining = allChapters.filter(c => c.id !== id);
      // 重新编号
      remaining.forEach((chap, idx) => {
        if (chap.number !== idx + 1) {
          useProjectStore.getState().updateChapter({ ...chap, number: idx + 1 });
        }
      });
      useProjectStore.setState({ chapters: remaining });
      useProjectStore.getState().saveProject();
      return;
    }
    const chapter = items.find(c => c.id === id);
    if (chapter) {
      updateChapter({ ...chapter, ...updates });
    }
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {items.map(chap => (
            <SortableChapter key={chap.id} chap={chap} onUpdate={handleUpdate} />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={() => {
          const { v4: uuidv4 } = require('uuid');
          const currentChapters = useProjectStore.getState().chapters;
          const newChapter = {
            id: uuidv4(),
            number: currentChapters.length + 1,
            title: `第${currentChapters.length + 1}章 新章节`,
            content: "",
            emotionProgress: 0,
            lustIntensity: 0,
          };
          useProjectStore.setState({ chapters: [...currentChapters, newChapter] });
          useProjectStore.getState().saveProject();
        }}
        className="w-full py-4 border border-dashed border-[#FF4D94]/50 rounded-2xl text-[#FF4D94] hover:bg-[#FF4D94]/10 transition-all"
      >
        + 新增章节
      </button>
    </div>
  );
}

