import { useProjectStore } from '../store/projectStore';

export function ExportMenu() {
  const { logs, currentProject } = useProjectStore();

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.time}] [${log.module}] ${log.action} ${log.details || ''}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `情色推导器_运行日志_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  const exportProject = () => {
    alert("项目已导出为文件夹（完整 manifest + md + json 文件）\n实际打包中会调用 electronAPI 保存整个项目文件夹");
  };

  return (
    <div className="flex gap-3">
      <button onClick={exportLogs} className="px-5 py-2 border border-[#FF4D94]/50 rounded-xl hover:bg-[#FF4D94]/10">
        导出运行日志
      </button>
      <button onClick={exportProject} className="px-5 py-2 bg-[#FF4D94] rounded-xl font-medium">
        导出完整项目
      </button>
    </div>
  );
}
