import useIsMobile from '../hooks/useIsMobile';
import HomeDesktop from './desktop/HomeDesktop';
import HomeMobile from './mobile/HomeMobile';

export default function Home() {
  const isMobile = useIsMobile();
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}
