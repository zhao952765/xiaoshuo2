import promptsData from '../../prompts.json';

export const globalEthics = promptsData.globalEthics;
export const promptLibrary = promptsData.promptLibrary;

export const getPromptById = (id: string) => 
  promptLibrary.find(p => p.id === id);

export const buildOneClickPrompt = (params: any): string => {
  const base = getPromptById('oneClickDeduce')?.content || '';
  return `${globalEthics}\n\n${base}\n\n【用户参数】\n${JSON.stringify(params, null, 2)}`;
};
