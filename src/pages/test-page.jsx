import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import media from "@/styles/media";

const Container = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  ${font.bold28}
  color: ${colors.purple[600]};
  margin-bottom: 40px;
`;

// 미디어 태그를 사용하여 반응형 스타일링
const ResponsiveBox = styled.div`
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;

  ${media.small`
    background: ${colors.blue[200]};
    ${font.regular14}
  `}

  ${media.medium`
    background: ${colors.green[200]};
    ${font.regular16}
  `}

  ${media.large`
    background: ${colors.purple[200]};
    ${font.regular18}
  `}
`;

export default function TestPage() {
  return (
    <Container>
      <Title>스타일 테스트</Title>
      <ResponsiveBox>
        <strong>창 크기를 조절해보세요</strong>
        <br />
        <br />
        모바일(~599px): 파란색 배경, 작은 폰트
        <br />
        태블릿(600~1023px): 초록색 배경, 중간 폰트
        <br />
        데스크톱(1024px~): 보라색 배경, 큰 폰트
      </ResponsiveBox>
    </Container>
  );
}
