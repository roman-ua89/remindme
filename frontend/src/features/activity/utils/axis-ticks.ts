/** X-axis labels for the Home activity charts: days 1, 5, 10, 15, 20, 25 and 30, as on the board. */
export const dayAxisTicks = (days: Array<number>): Array<number> => days.filter((day) => day === 1 || day % 5 === 0);
