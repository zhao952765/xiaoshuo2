import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProjectStore } from '../store/projectStore';

function SortableItem({ chapter }: { chapter: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="bg-[#272732] p-5 rounded-2xl flex items-center gap-4 mb-3 cursor-grab active:cursor-grabbing border border-transparent hover:border-[#FF4D94]/50"
    >
      <span className="text-[#FF4D94] font-mono w-8">#{chapter.number}</span>
      <input 
        defaultValue={chapter.title}
        className="flex-1 bg-transparent focus:outline-none font-medium"
      />
      <div className="text-xs text-gray-400 whitespace-nowrap">
        情 {chapter.emotionProgress}% | 欲 {chapter.lustIntensity}★
      </div>
    </div>
  );
}

export default function ChapterTree() {
  const { chapters } = useProjectStore();
  const [items, setItems] = useState(chapters);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id)));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((chap: any) => <SortableItem key={chap.id} chapter={chap} />)}
        </div>
      </SortableContext>
      <button className="mt-6 w-full py-4 border-2 border-dashed border-[#FF4D94]/50 rounded-2xl text-[#FF4D94] hover:bg-[#FF4D94]/10">
        + 新增章节
      </button>
    </DndContext>
  );
}
