import * as allOpenCV from './openCV';
export * from './openCV';

declare function cvFactory (): typeof  allOpenCV
export default cvFactory;
