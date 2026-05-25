import { app } from '@/app.js'
import { env } from "@/env"

const PORT = env.PORT

app.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`)})