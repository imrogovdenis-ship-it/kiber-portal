import dimensions from '../../data/media/robot-rendered-image-dimensions.json';
export function robotImageDimensions(src: string): {width:number;height:number} {
 const result = (dimensions as Record<string,{width:number;height:number}>)[src];
 if (!result) throw new Error(`Missing verified image dimensions: ${src}`);
 return result;
}
