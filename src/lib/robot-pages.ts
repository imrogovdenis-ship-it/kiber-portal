import robotsGenerated from '../content/robots.generated.json';

export type RobotPageRecord = (typeof robotsGenerated.robots)[number];

export function getRobotPages(): RobotPageRecord[] {
  return [...robotsGenerated.robots];
}

export function getRobotPageBySlug(slug: string): RobotPageRecord | undefined {
  return robotsGenerated.robots.find((robot) => robot.slug === slug);
}

export function getRobotPageCount() {
  return robotsGenerated.count;
}
