import { HOUR, MIN, SEC } from '@/config/constant';

export interface ITimeStage {
  /** stage sequence */
  id: number
  /** stage name */
  stage: string
  /** stage duration */
  duration: number
}

export const getTime = (ms: number) => {
  const hrs = Math.floor(ms / HOUR);
  const mins = Math.floor((ms - hrs * HOUR) / MIN);
  const secs = Math.floor((ms - hrs * HOUR - mins * MIN) / SEC);
  return {
    hrs,
    mins,
    secs,
  };
};

// eslint-disable-next-line consistent-return
export const timeInStage = (leftTime: number, stages: ITimeStage[]) => {
  const sortedStages = stages.sort((a, b) => a.id - b.id);
  const roundTime = sortedStages.reduce((prev, cur) => prev + cur.duration, 0);

  const leftRounds = Math.floor(leftTime / roundTime);
  const currentRoundLeftTime = leftTime - leftRounds * roundTime;

  console.log('timeInStage', roundTime, leftRounds, currentRoundLeftTime);

  let period = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sortedStages.length; i++) {
    period += sortedStages[i].duration;
    if (currentRoundLeftTime > roundTime - period) {
      const leftTimeInThisStage = currentRoundLeftTime - (roundTime - period);
      const { hrs, mins, secs } = getTime(currentRoundLeftTime);
      const { hrs: leftHrs, mins: leftMins, secs: leftSecs } = getTime(leftTimeInThisStage);
      const obj = {
        currentState: sortedStages[i],
        leftRounds,
        hrs,
        mins,
        secs,
        leftHrs,
        leftMins,
        leftSecs,
      };
      console.log(obj);
      return obj;
    }
  }
};
