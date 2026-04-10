"use client";
import { useState, useEffect } from "react";

// Definição dos pontos de interesse no mapa 1200x1200px
export const WAYPOINTS = {
    EXECUTIVE_DESK: [
        { top: 620, left: 330 }, // Cadeira 1 (Alpha)
        { top: 620, left: 450 }, // Cadeira 2 (Beta)
        { top: 780, left: 330 }, // Cadeira 3 (Gamma)
        { top: 780, left: 450 }, // Cadeira 4 (Delta)
    ],
    CREATIVE_WORKSHOP: [
        { top: 350, left: 330 }, // Bancada Norte
        { top: 450, left: 400 }, // Bancada Sul
        { top: 380, left: 480 }, // Perto da arara
    ],
    WAR_ROOM: [
        { top: 150, left: 650 }, // Cadeira Norte
        { top: 250, left: 580 }, // Cadeira Oeste
        { top: 250, left: 720 }, // Cadeira Leste
        { top: 350, left: 650 }, // Cadeira Sul
    ],
    LOUNGE: [
        { top: 730, left: 740 }, // Sofá S1
        { top: 730, left: 860 }, // Sofá S2
        { top: 900, left: 740 }, // Sofá Inferior
    ],
    COFFEE: { top: 510, left: 810 },
    SERVER: { top: 470, left: 850 },
};

interface AgentState {
    id: string;
    position: { top: number; left: number };
    thought: string;
}

export function useAgentLife(initialAgents: any[]) {
    const [agentStates, setAgentStates] = useState<AgentState[]>(
        initialAgents.map(a => ({
            id: a.id,
            position: a.position,
            thought: ""
        }))
    );

    useEffect(() => {
        // Intervalo Zen: 5 a 10 minutos (convertido em ms)
        // Para testes, vamos usar um intervalo menor inicialmente ou um Math.random
        const interval = setInterval(() => {
            setAgentStates(prev => {
                const next = [...prev];
                // Escolhe um agente aleatório para se mover
                const targetIdx = Math.floor(Math.random() * next.length);
                const agent = next[targetIdx];

                // Escolhe um novo destino aleatório
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

                // Limpa o pensamento após 5 segundos
                setTimeout(() => {
                    setAgentStates(current => {
                        const updated = [...current];
                        updated[targetIdx].thought = "";
                        return updated;
                    });
                }, 5000);

                return next;
            });
        }, 120000); // 2 minutos para um efeito mais visível para o diretor, mas ainda "Zen"

        return () => clearInterval(interval);
    }, []);

    return agentStates;
}
