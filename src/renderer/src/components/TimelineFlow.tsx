import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = {
  padding: 12,
  borderRadius: 16,
  background: '#1A1A22',
  border: '2px solid #FF4D94',
  color: 'white',
  width: 260,
};

function EmotionNode({ data }: any) {
  return (
    <div style={nodeStyle} className="text-center">
      <div className="text-xs text-[#FF4D94] mb-1">第{data.chapter}章</div>
      <div className="font-bold text-lg mb-2">{data.title}</div>
      <div className="text-sm text-gray-300 mb-3 line-clamp-2">{data.description}</div>
      <div className="h-2 bg-[#272732] rounded-full overflow-hidden">
        <div className="h-full bg-[#FF4D94]" style={{ width: `${data.intensity * 10}%` }} />
      </div>
      <div className="text-xs mt-1 text-gray-400">{data.intensity}/10</div>
    </div>
  );
}

function LustNode({ data }: any) {
  return (
    <div style={{ ...nodeStyle, borderColor: '#f472b6' }} className="text-center">
      <div className="text-xs text-pink-400 mb-1">第{data.chapter}章 • {data.intensity}★</div>
      <div className="font-bold text-lg mb-2">{data.sceneTitle}</div>
      <div className="flex flex-wrap gap-1 justify-center">
        {data.tags?.map((tag: string, i: number) => (
          <span key={i} className="text-xs bg-pink-500/20 px-3 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = { emotionNode: EmotionNode, lustNode: LustNode };

export default function TimelineFlow({ type, data }: any) {
  const nodes: Node[] = (data?.points || []).map((p: any, i: number) => ({
    id: p.id,
    type: type === 'emotion' ? 'emotionNode' : 'lustNode',
    position: { x: i * 320, y: 60 + (i % 3) * 100 },
    data: p,
  }));

  const edges: Edge[] = nodes.slice(1).map((_, i) => ({
    id: `e${i}`,
    source: nodes[i].id,
    target: nodes[i + 1].id,
    type: 'smoothstep',
    animated: true,
  }));

  return (
    <div className="h-full w-full border border-[#FF4D94]/20 rounded-3xl overflow-hidden">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#333" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
