import { GarlandLight, GarlandRow, GarlandTone } from './Garland.styles';

const TONES: GarlandTone[] = ['highlight', 'accent', 'heading', 'title'];
const LIGHT_COUNT = 34;
const COMPACT_LIGHT_COUNT = 12;

type GarlandProps = {
  /** Horizontal inset. Omitted, the row uses the page side padding. */
  padding?: string;
  /** Vertical scale of the sine. 1 is one `xsmall` of sag; 0 is a flat line. */
  curvature?: number;
  /** Offset from the top. Omitted, it sits at -12px and moves to 0 from the medium breakpoint. */
  top?: string;
  /** Lights in the row. This is how many show from the medium breakpoint. */
  count?: number;
  /** How many of those stay visible below the medium breakpoint. */
  compactCount?: number;
};

const Garland = ({
  padding,
  curvature = 1,
  top,
  count = LIGHT_COUNT,
  compactCount = COMPACT_LIGHT_COUNT,
}: GarlandProps) => {
  const lights = Math.max(0, Math.floor(count));
  const compact = Math.min(Math.max(0, Math.floor(compactCount)), lights);
  const span = Math.max(lights - 1, 1);

  return (
    <GarlandRow
      $padding={padding}
      $top={top}
      $compactCount={compact}
      aria-hidden="true"
    >
      {Array.from({ length: lights }, (_, index) => (
        <GarlandLight
          key={index}
          $tone={TONES[index % TONES.length]}
          $wave={Math.sin((index / span) * Math.PI * 2)}
          $curvature={curvature}
        />
      ))}
    </GarlandRow>
  );
};

export default Garland;
