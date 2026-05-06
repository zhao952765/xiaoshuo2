import promptsData from '../../prompts.json';

export const globalEthics = promptsData.globalEthics;

export const promptLibrary = promptsData.promptLibrary;

export const getPromptById = (id: string) => {
  return promptLibrary.find(p => p.id === id);
};

export const buildOneClickPrompt = (userParams: any) => {
  const basePrompt = getPromptById('oneClickDeduce')?.content || '';
  return `${globalEthics}\n\n${basePrompt}\n\n用户参数：\n${JSON.stringify(userParams, null, 2)}\n\n请严格按照指定格式输出完整前期推导包。`;
};

export const buildSexScenePrompt = () => {
  return `${globalEthics}\n\n${getPromptById('sexScene')?.content}`;
};
