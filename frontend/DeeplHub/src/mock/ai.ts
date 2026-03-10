function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const cannedReplies = [
  '可以先从实验目标、输入输出和评估指标三部分梳理。',
  '建议先做一个最小可运行版本，再逐步补充训练与可视化能力。',
  '你可以把这个问题拆成数据准备、模型设计和验证流程三个小任务。',
  '如果你愿意，我可以继续给出这个模块的目录和接口建议。',
]

export async function mockAiReply(question: string): Promise<string> {
  await wait(450)

  const hint = cannedReplies[Math.floor(Math.random() * cannedReplies.length)]
  return `收到：${question}\n${hint}`
}
