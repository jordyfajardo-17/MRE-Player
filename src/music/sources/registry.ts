import type { MusicSource } from '../core/types';
import { demoSource } from './demo';
export class SourceRegistry {
  private readonly sources = new Map<string, MusicSource>();
  register(source: MusicSource): void {
    if (this.sources.has(source.id)) throw new Error(`La fuente ${source.id} ya está registrada.`);
    this.sources.set(source.id, source);
  }
  get(id: string): MusicSource {
    const source = this.sources.get(id);
    if (!source) throw new Error(`Fuente no registrada: ${id}`);
    return source;
  }
}
export const sourceRegistry = new SourceRegistry();
sourceRegistry.register(demoSource);
