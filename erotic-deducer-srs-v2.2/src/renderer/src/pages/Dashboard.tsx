import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import { ExportMenu } from '../components/ExportMenu';

export default function Dashboard() {
  const { projects, logs, currentProject, chapters, characters } = useProjectStore();

  // 统计数据
  const totalWords = currentProject?.totalWords || 0;
  const completion = currentProject?.completion || 0;
  const chapterCount = chapters.length;
  const characterCount = characters.length;

  return (
    <div className="p-8">
      {/* 标题区 */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-5xl font-bold text-[#FF4D94]">仪表盘</h1>
          <p className="text-gray-400 mt-2">情色推导器 SRS v2.2</p>
        </div>
        <ExportMenu />
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20 hover:border-[#FF4D94]/40 transition-colors">
          <div className="text-[#FF4D94] text-sm font-medium">当前项目</div>
          <div className="text-3xl font-bold mt-3">{currentProject?.title || "无"}</div>
          <div className="text-gray-500 text-xs mt-2">{currentProject?.type || "未创建"} · {currentProject?.scale || "-"}</div>
        </div>

        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20 hover:border-[#FF4D94]/40 transition-colors">
          <div className="text-[#FF4D94] text-sm font-medium">总字数</div>
          <div className="text-3xl font-bold mt-3">{totalWords.toLocaleString()}</div>
          <div className="text-gray-500 text-xs mt-2">目标 {currentProject?.targetWords?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20 hover:border-[#FF4D94]/40 transition-colors">
          <div className="text-[#FF4D94] text-sm font-medium">章节 / 角色</div>
          <div className="text-3xl font-bold mt-3">{chapterCount} <span className="text-xl text-gray-500">/</span> {characterCount}</div>
          <div className="text-gray-500 text-xs mt-2">章节数 · 角色数</div>
        </div>

        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20 hover:border-[#FF4D94]/40 transition-colors">
          <div className="text-[#FF4D94] text-sm font-medium">完成度</div>
          <div className="text-3xl font-bold mt-3">{completion}%</div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF4D94] to-[#FF8DC7] transition-all duration-500"
              style={{ width: `${Math.min(100, completion)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 项目概览 + 快捷信息 */}
      {currentProject && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 故事梗概 */}
          <div className="bg-[#1A1A22] rounded-3xl p-8 border border-[#FF4D94]/10">
            <h2 className="text-xl font-semibold mb-4 text-[#FF4D94]">故事梗概</h2>
            <div className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-auto whitespace-pre-wrap">
              {useProjectStore.getState().overview || "暂无故事梗概，请先创建项目并使用一键推导..."}
            </div>
          </div>

          {/* 项目信息 */}
          <div className="bg-[#1A1A22] rounded-3xl p-8 border border-[#FF4D94]/10">
            <h2 className="text-xl font-semibold mb-4 text-[#FF4D94]">项目信息</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">项目ID</span>
                <span className="text-gray-300 font-mono text-xs">{currentProject.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">类型</span>
                <span className="text-gray-300">{currentProject.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">尺度</span>
                <span className="text-gray-300">{currentProject.scale}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">创建时间</span>
                <span className="text-gray-300">{format(new Date(currentProject.createdAt), 'yyyy-MM-dd HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最后修改</span>
                <span className="text-gray-300">{format(new Date(currentProject.lastModified), 'yyyy-MM-dd HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">历史项目</span>
                <span className="text-gray-300">{projects.length} 个</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 运行日志 */}
      <div className="bg-[#1A1A22] rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">运行日志</h2>
          <span className="text-gray-500 text-sm">共 {logs.length} 条</span>
        </div>
        <div className="max-h-[500px] overflow-auto space-y-4 text-sm font-mono">
          {logs.length === 0 ? (
            <div className="text-gray-600 text-center py-8">暂无日志记录</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-6">
                <span className="text-gray-500 w-48 shrink-0">
                  {format(new Date(log.time), 'MM-dd HH:mm:ss')}
                </span>
                <span className="text-[#FF4D94] w-28 shrink-0">[{log.module}]</span>
                <span className="text-gray-300">{log.action}</span>
                {log.details && (
                  <span className="text-gray-600 truncate ml-2">{log.details}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
