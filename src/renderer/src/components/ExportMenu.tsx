import { useProjectStore } from '../store/projectStore';

export function ExportMenu() {
  const { logs, currentProject } = useProjectStore();

  const exportLogs = () => {
    const text = logs.map(l => `[${l.time}] [${l.module}] ${l.action}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srs-logs-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  return (
    <div className="flex gap-3">
      <button onClick={exportLogs} className="px-5 py-2.5 border border-[#FF4D94]/50 rounded-2xl hover:bg-[#FF4D94]/10">
        导出日志
      </button>
      <button className="px-5 py-2.5 bg-[#FF4D94] rounded-2xl">导出项目</button>
    </div>
  );
}
