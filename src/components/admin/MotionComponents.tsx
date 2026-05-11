"use client";

import { motion } from 'framer-motion';

/**
 * HOOKE HQ: MOTION SHIELD
 * Componentes motion castados para 'any' para evitar conflitos de tipos entre 
 * Framer Motion e os novos tipos do React 19/Next 16 no ambiente de build.
 */
export const MotionDiv = motion.div as any;
export const MotionForm = motion.form as any;
export const MotionSpan = motion.span as any;
export const MotionNav = motion.nav as any;
export const MotionButton = motion.button as any;
