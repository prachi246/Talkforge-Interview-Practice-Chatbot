
// Fix: Add minimal type declarations for the AudioWorkletGlobalScope. This allows
// TypeScript to recognize AudioWorklet-specific globals like `registerProcessor`
// and the base `AudioWorkletProcessor` class without requiring special tsconfig libs.
declare class AudioWorkletProcessor {
  readonly port: {
    postMessage(message: any): void;
    onmessage: ((ev: any) => any) | null;
  };
  constructor(options?: any);
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
declare function registerProcessor(name: string, processorCtor: new (options?: any) => AudioWorkletProcessor): void;


// This script runs in a separate thread (AudioWorkletGlobalScope)
// It receives raw audio data from the microphone and forwards it to the main thread.

// Fix: Renamed the class from 'AudioWorkletProcessor' to 'TalkForgeAudioProcessor'
// to avoid a naming conflict with the global type, which was causing a circular reference error.
class TalkForgeAudioProcessor extends AudioWorkletProcessor {
  private buffer: Int16Array = new Int16Array(0);
  private bufferSize: number = 2048; // Send data in chunks of this size
  private isStopped: boolean = false;

  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data.type === 'stop') {
        this.isStopped = true;
      }
    };
  }

  // This method is called by the browser for each block of audio data
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    if (this.isStopped) {
      return false; // Stop processing
    }

    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      if (channelData) {
        const int16Data = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          int16Data[i] = channelData[i] * 32768;
        }

        const newBuffer = new Int16Array(this.buffer.length + int16Data.length);
        newBuffer.set(this.buffer, 0);
        newBuffer.set(int16Data, this.buffer.length);
        this.buffer = newBuffer;
      }
    }

    // When the buffer is full enough, send it to the main thread
    while (this.buffer.length >= this.bufferSize) {
      const chunk = this.buffer.slice(0, this.bufferSize);
      this.port.postMessage({ type: 'audioData', buffer: new Uint8Array(chunk.buffer) });
      this.buffer = this.buffer.slice(this.bufferSize);
    }
    
    // Return true to keep the processor alive
    return true;
  }
}

registerProcessor('audio-worklet-processor', TalkForgeAudioProcessor);