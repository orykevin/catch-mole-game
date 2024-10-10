import { Record } from "../functions/records";
import { formatDate } from "../functions/utils";

export const ScoreRecords = ({ onClose }: { onClose: () => void }) => {
  const localStorageRecord = localStorage.getItem("records");
  const records = localStorageRecord
    ? (JSON.parse(localStorageRecord) as Record[])
    : [];
  console.log(records);
  return (
    <div className="score-records">
      <button
        className="reset-btn"
        onClick={() => {
          localStorage.clear();
          onClose();
        }}
      >
        reset
      </button>
      <button className="close-btn" onClick={onClose}>
        ❌
      </button>
      <h2>Score Records</h2>
      <div className="table-container">
        <div className="table">
          <div className="row thead">
            <div className="cell">Mode</div>
            <div className="cell">Clicks</div>
            <div className="cell">Accuracy</div>
            <div className="cell">Time</div>
            <div className="cell">Date</div>
          </div>
          {records.map((record, index) => (
            <div key={index} className="row">
              <div className="cell">{record?.mode}</div>
              <div className="cell">{record.clicked}</div>
              <div className="cell">
                {record.accuracy % 1 !== 0
                  ? record.accuracy.toFixed(2)
                  : record.accuracy}
                %
              </div>
              <div className="cell">{record.time}</div>
              <div className="cell">{formatDate(record.date)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
