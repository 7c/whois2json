import { domainStatus  } from "./types"

export interface IrawParser {
    isFree():boolean
    isRegistered():boolean
    isReserved():boolean
    parseRegistrar(): string | null
    parseUpdateDate(): Date | boolean
    parseExpiration(): Date | boolean
    parseCreationDate(): Date | boolean
    parseNameservers():string[]
    parseStatus():domainStatus[]
}