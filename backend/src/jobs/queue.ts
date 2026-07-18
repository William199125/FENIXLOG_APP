type Job = { type: string; payload: any };

const queue: Job[] = [];
let processing = false;

export function enqueue(job: Job) {
  queue.push(job);
  console.log(`[QUEUE] Job encolado: ${job.type}`);
  processQueue();
}

async function processQueue() {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift()!;
    try {
      await handleJob(job);
    } catch (err) {
      console.error(`[QUEUE] Error procesando job ${job.type}:`, err);
    }
  }

  processing = false;
}

async function handleJob(job: Job) {
  const { notificarNuevaOrden } = await import("./notificacion.worker");
  if (job.type === "NOTIFICAR_NUEVA_ORDEN") {
    await notificarNuevaOrden(job.payload);
  }
}