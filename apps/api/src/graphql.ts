
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    trials(): Trial[] | Promise<Trial[]>;
    trial(id: number): Nullable<Trial> | Promise<Nullable<Trial>>;
    participants(): Participant[] | Promise<Participant[]>;
    participant(id: number): Nullable<Participant> | Promise<Nullable<Participant>>;
}

export interface Trial {
    id: number;
    name: string;
    participants: Participant[];
    participantCount: number;
}

export interface Participant {
    id: number;
    name: string;
    height: number;
    weight: number;
    hasDiabetes: boolean;
    hadCovid: boolean;
    trialId: number;
    trial: Trial;
}

export interface IMutation {
    createTrial(name: string): Trial | Promise<Trial>;
    createParticipant(name: string, height: number, weight: number, hasDiabetes: boolean, hadCovid: boolean, trialId: number): Participant | Promise<Participant>;
}

type Nullable<T> = T | null;
