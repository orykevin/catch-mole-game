declare global {
    interface Window {
      confetti: (options?: ConfettiOptions) => void;
    }
  }
  
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
  }

export type Record = {
    mode: string
    clicked: number
    score: number
    accuracy: number
    time: number
    date: Date
}

const launchConfetti = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      console.error('Confetti function not loaded.');
    }
  };

export const setNewRecord = (record : Record) => {
    const localStorageRecord = localStorage.getItem('records')
    const pastRecords = localStorageRecord ? JSON.parse(localStorageRecord) as Record[] : [];
    const pastRecordsByMode = pastRecords.filter(r => r.mode === record.mode);
    if (pastRecords.length > 0) {
        pastRecords.unshift(record);
        localStorage.setItem('records', JSON.stringify(pastRecords));
    }else{
        localStorage.setItem('records', JSON.stringify([record]));
    }

    const newRecord =[]
    const allTimeRecord = pastRecordsByMode.map(r => r.time);
    const allClickedRecord = pastRecordsByMode.map(r => r.clicked);
    const allAccuracyRecord = pastRecordsByMode.map(r => r.accuracy);

    if(allTimeRecord.every(r => record.time < r)){
        newRecord.push('Time');
    }
    if(allClickedRecord.every(r =>record.clicked < r)){
        newRecord.push('Clicked');
    }
    if(allAccuracyRecord.every(r => record.accuracy > r)){
        newRecord.push('Accuracy');
    }
    // check if new record is better

    if(newRecord.length > 0){
        launchConfetti();
        return newRecord
    }else{
        return null
    }
}