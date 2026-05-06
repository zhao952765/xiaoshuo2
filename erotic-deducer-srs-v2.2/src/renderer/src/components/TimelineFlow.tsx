import ReactFlow, { 
  Node, Edge, Background, Controls, MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = { emotionNode: EmotionNode, lustNode: LustNode };

function EmotionNode({ data }: any) {
  return (
    <div className="bg-[#1A1A22] border-2 border-[#FF4D94] rounded-2xl p-4 w-64 shadow-xl">
      <div className="text-xs text-[#FF4D94]">第{data.chapter}章</div>
      <div className="font-bold">{data.title}</div>
      <div className="text-sm mt-2 text-gray-300">{data.description}</div>
      <div className="mt-3 h-2 bg-[#272732] rounded">
        <div className="h-2 bg-[#FF4D94]" style={{width: `${data.intensity * 10}%`}}></div>
      </div>
    </div>
  );
}

function LustNode({ data }: any) {
  return (
    <div className="bg-[#1A1A22] border-2 border-pink-500 rounded-2xl p-4 w-64 shadow-xl">
      <div className="text-xs text-pink-400">第{data.chapter}章 • {data.intensity}★</div>
      <div className="font-bold text-pink-300">{data.sceneTitle}</div>
      <div className="text-xs mt-1 text-gray-400">{data.tags?.join(' · ')}</div>
    </div>
  );
}

export default function TimelineFlow({ type, data, onChange }: any) {
  const nodes: Node[] = data?.points?.map((p: any, i: number) => ({
    id: p.id,
    type: type === 'emotion' ? 'emotionNode' : 'lustNode',
    position: { x: i * 280, y: 50 + (i % 3) * 80 },
    data: p,
  })) || [];

  const edges: Edge[] = nodes.slice(1).map((node, i) => ({
    id: `e${i}`,
    source: nodes[i].id,
    target: node.id,
    type: 'smoothstep',
  }));

  return (
    <div className="h-full w-full">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodesChange={onChange}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
