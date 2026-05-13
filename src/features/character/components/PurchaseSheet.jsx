import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1100;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${colors.gray[100]};
  border-radius: 16px 16px 0 0;
  padding: 24px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  ${font.semibold16}
  color: ${colors.gray[900]};
  margin: 0;
`;

const Preview = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 12px;
  background: ${colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
`;

const PriceValue = styled.span`
  ${font.semibold20}
  color: ${colors.blue[50]};
`;

const PriceUnit = styled.span`
  ${font.semibold14}
  color: ${colors.gray[900]};
`;

const BalanceNote = styled.p`
  ${font.regular12}
  color: ${colors.gray[600]};
  margin: 0;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${colors.gray[200]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  ${font.medium14}
  color: ${colors.gray[900]};
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${(p) => (p.disabled ? colors.gray[300] : colors.blue[50])};
  color: ${colors.gray[100]};
  border: none;
  border-radius: 8px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  ${font.medium14}
`;

/**
 * 아이템 구매 바텀 시트.
 * @param {object} props
 * @param {{id, src, price}|null} props.item - 구매 대상 아이템 (null 이면 시트 닫힘)
 * @param {number} props.balance - 보유 포인트
 * @param {boolean} props.loading - 구매 진행 중
 * @param {function} props.onConfirm - 구매 확정 콜백
 * @param {function} props.onClose - 닫기 콜백
 */
export default function PurchaseSheet({ item, balance, loading, onConfirm, onClose }) {
  if (!item) return null;
  const canAfford = balance >= item.price;
  return (
    <Backdrop role="dialog" aria-modal="true" onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Title>이 아이템을 구매할까요?</Title>
        <Preview>
          <img src={item.src} alt={item.id} />
        </Preview>
        <PriceRow>
          <PriceValue>{item.price}</PriceValue>
          <PriceUnit>P</PriceUnit>
        </PriceRow>
        <BalanceNote>
          {canAfford
            ? `구매 후 잔여 포인트 ${balance - item.price}P`
            : `포인트가 부족해요 (보유 ${balance}P)`}
        </BalanceNote>
        <ButtonRow>
          <SecondaryButton type="button" onClick={onClose} disabled={loading}>
            취소
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={onConfirm}
            disabled={!canAfford || loading}
          >
            {loading ? "구매 중…" : `${item.price}P 결제`}
          </PrimaryButton>
        </ButtonRow>
      </Sheet>
    </Backdrop>
  );
}
