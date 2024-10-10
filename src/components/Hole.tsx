import moleImg from "../assets/images/mole.png";

interface HoleProps extends React.HTMLAttributes<HTMLDivElement> {
  isMoleVisible: boolean;
}

export const Hole: React.FC<HoleProps> = ({ isMoleVisible, ...props }) => {
  return (
    <div data-testid="hole" className="hole" {...props}>
      {isMoleVisible && <img data-testid="mole" src={moleImg} />}
    </div>
  );
};
