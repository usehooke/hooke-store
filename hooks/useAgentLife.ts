"use client";
import { useState, useEffect } from "react";

// Definição dos pontos de interesse no mapa 1500x1500px refinado
export const WAYPOINTS = {
    EXECUTIVE_DESK: [
        { top: 720, left: 650 }, 
        { top: 720, left: 850 }, 
        { top: 820, left: 650 }, 
        { top: 820, left: 850 },
    ],
    CREATIVE_WORKSHOP: [
        { top: 400, left: 200 },
        { top: 550, left: 150 },
        { top: 700, left: 250 },
    ],
    WAR_ROOM: [
        { top: 250, left: 750 },
        { top: 320, left: 600 },
        { top: 320, left: 900 },
    ],
    LOUNGE: [
        { top: 1150, left: 800 },
        { top: 1250, left: 950 },
    ],
    ZEN_ZONE: [
        { top: 1000, left: 1250 },
        { top: 1100, left: 1200 },
    ],
};

const RANDOM_THOUGHTS = [
    "Refinando a voz da marca...",
    "Analisando métricas de conversão...",
    "Otimizando o funil Hooke...",
    "Planejando o próximo drop...",
    "Código limpo, alma limpa.",
    "Café? Sempre uma boa ideia.",
    "A estética é o nosso norte.",
    "Pensando em novas texturas...",
    "Ajustando o algoritmo de elite...",
    "Sincronizando com o Vercel...",
    "Explorando novas silhuetas...",
    "O minimalismo é a sofisticação máxima.",
    "Hora de criar algo extraordinário.",
];

interface AgentState {
    id: string;
    position: { top: number; left: number };
    thought: string;
    status: "online" | "busy" | "away";
}

export function useAgentLife(initialAgents: any[]) {
    const statuses: ("online" | "busy" | "away")[] = ["online", "busy", "away"];

    const [agentStates, setAgentStates] = useState<AgentState[]>(
        initialAgents.map(a => ({
            id: a.id,
            position: a.position,
            thought: "",
            status: "online" // Valor determinístico para o build
        }))
    );

    useEffect(() => {
        // Randomização inicial apenas no cliente para evitar erros de hydration/PPR
        setAgentStates(prev => prev.map(a => ({
            ...a,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        })));

        // Intervalo de Movimento Zen: 45 a 90 segundos
        const moveInterval = setInterval(() => {
            setAgentStates(prev => {
                const next = [...prev];
                const targetIdx = Math.floor(Math.random() * next.length);
                const agent = next[targetIdx];

                const roomKeys = Object.keys(WAYPOINTS);
                const randomRoomKey = roomKeys[Math.floor(Math.random() * roomKeys.length)];
                //@ts-ignore
                const roomData = WAYPOINTS[randomRoomKey];
                
                let newPos;
                if (Array.isArray(roomData)) {
                    newPos = roomData[Math.floor(Math.random() * roomData.length)];
                } else {
                    newPos = roomData;
                }

                next[targetIdx] = {
                    ...agent,
                    position: newPos,
                    thought: "Indo para " + randomRoomKey.replace("_", " ") + "..."
                };

                setTimeout(() => {
                    setAgentStates(current => {
                        const updated = [...current];
                        updated[targetIdx].thought = "";
                        return updated;
                    });
                }, 4000);

                return next;
            });
        }, 50000);

        // Intervalo de Pensamentos Aleatórios (quando parados)
        const thoughtInterval = setInterval(() => {
            setAgentStates(prev => {
                const next = [...prev];
                // 30% de chance de alguém ter um pensamento aleatório
                if (Math.random() > 0.7) {
                    const targetIdx = Math.floor(Math.random() * next.length);
                    // Só pensa se não estiver "indo para algum lugar"
                    if (!next[targetIdx].thought.includes("Indo")) {
                        next[targetIdx].thought = RANDOM_THOUGHTS[Math.floor(Math.random() * RANDOM_THOUGHTS.length)];
                        
                        setTimeout(() => {
                            setAgentStates(current => {
                                const updated = [...current];
                                updated[targetIdx].thought = "";
                                return updated;
                            });
                        }, 6000);
                    }
                }
                return next;
            });
        }, 8000);

        return () => {
            clearInterval(moveInterval);
            clearInterval(thoughtInterval);
        };
    }, []);

    return agentStates;
}
