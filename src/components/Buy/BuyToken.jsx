// Updated: 1 Ft = 1 token pricing model
import React, { useState } from 'react';

const PACKAGES = [
  { id: 'p100', label: '100 token', tokens: 100, price: 100 },
  { id: 'p250', label: '250 token', tokens: 250, price: 250 },
  { id: 'p500', label: '500 token', tokens: 500, price: 500 }
];

const TEST_CARD_NUMBER = '4242424242424242';
const TEST_CVV = '123';

function formatPrice(huf) {
  return `${huf.toLocaleString('hu-HU')} Ft`;
}

function cleanNumber(s) {
  return (s || '').replace(/\s+/g, '');
}

function validateExpiry(exp) {
  if (!exp) return false;
  const m = exp.match(/^(\d{1,2})\s*\/\s*(\d{2,4})$/);
  if (!m) return false;
  let month = parseInt(m[1], 10);
  let year = parseInt(m[2], 10);
  if (m[2].length === 2) year += 2000;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const expMonth = new Date(year, month - 1, 1);
  return expMonth >= thisMonth;
}

export default function BuyToken() {
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0].id);
  const [customTokens, setCustomTokens] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const currentPackage = PACKAGES.find(p => p.id === selectedPackage);
  const tokens = customTokens ? Number(customTokens) : currentPackage.tokens;

  // New pricing: 1 Ft = 1 token
  const price = customTokens ? Math.max(0, Math.round(Number(customTokens))) : currentPackage.price;

  const cardNumClean = cleanNumber(cardNumber);
  const isCardNumberValid = cardNumClean.length === 16 && /^\d+$/.test(cardNumClean);
  const isExpiryValid = validateExpiry(expiry);
  const isCvvValid = /^\d{3,4}$/.test(cvv);

  const isTestCard = cardNumClean === TEST_CARD_NUMBER && cvv === TEST_CVV && isExpiryValid;

  const allFieldsFilled = tokens > 0 && (customTokens ? !Number.isNaN(Number(customTokens)) : true) && cardNumber && expiry && cvv;
  const canBuy = allFieldsFilled && isCardNumberValid && isExpiryValid && isCvvValid && isTestCard && !processing;

  const handleBuy = (e) => {
    e.preventDefault();
    setMessage('');
    if (!allFieldsFilled) {
      setMessage('Tölts ki minden mezőt!');
      return;
    }
    if (!isCardNumberValid) {
      setMessage('Érvénytelen kártyaszám.');
      return;
    }
    if (!isExpiryValid) {
      setMessage('Érvénytelen lejárat.');
      return;
    }
    if (!isCvvValid) {
      setMessage('Érvénytelen CVV.');
      return;
    }
    if (!isTestCard) {
      setMessage('A demo csak a tesztkártyát fogadja el (4242 4242 4242 4242 / CVV 123).');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setMessage(`Sikeres vásárlás — ${tokens} token vásárolva (${formatPrice(price)})`);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCustomTokens('');
      setSelectedPackage(PACKAGES[0].id);
    }, 800);
  };

  const handleExpiryChange = (raw) => {
    const digits = (raw || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      const mm = digits.slice(0, 2);
      const yy = digits.slice(2);
      setExpiry(`${mm}/${yy}`);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: '#273858ff',
      paddingTop: '60px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        width: '360px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Token vásárlás</h2>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#555' }}>Válassz csomagot vagy írj be egyedi mennyiséget.</p>

        <div style={{ marginBottom: 12 }}>
          {PACKAGES.map(p => (
            <label key={p.id} style={{ display: 'block', marginBottom: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                name="package"
                checked={selectedPackage === p.id && !customTokens}
                onChange={() => { setSelectedPackage(p.id); setCustomTokens(''); }}
                style={{ marginRight: 8 }}
              />
              <strong>{p.label}</strong> — {formatPrice(p.price)}
            </label>
          ))}

          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Egyedi mennyiség:
            </label>
            <input
              type="number"
              placeholder="Token mennyiség (pl. 150)"
              value={customTokens}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                setCustomTokens(v);
                if (v) setSelectedPackage(null);
                else setSelectedPackage(PACKAGES[0].id);
              }}
              style={{ padding: '8px', width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
            />
            <small style={{ color: '#666' }}>{customTokens ? `Ár: ${formatPrice(price)}` : 'Árcsomagok: lásd fent.'}</small>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />

        <h3 style={{ margin: '8px 0' }}>Bankkártya adatok</h3>
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Kártyaszám (teszt: 4242 4242 4242 4242)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: 6, border: `1px solid ${cardNumber && !isCardNumberValid ? 'red' : '#ccc'}` }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            style={{ padding: '10px', width: '60%', borderRadius: 6, border: `1px solid ${expiry && !isExpiryValid ? 'red' : '#ccc'}` }}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            style={{ padding: '10px', width: '40%', borderRadius: 6, border: `1px solid ${cvv && !isCvvValid ? 'red' : '#ccc'}` }}
          />
        </div>

        <div style={{ marginTop: 6, marginBottom: 12 }}>
          <strong>Végösszeg: </strong>
          <span>{formatPrice(price)}</span>
        </div>

        <button
          onClick={handleBuy}
          disabled={!canBuy}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 8,
            border: 'none',
            cursor: canBuy ? 'pointer' : 'not-allowed',
            backgroundColor: canBuy ? '#007bff' : '#9bb6e6',
            color: 'white',
            fontWeight: '600'
          }}
        >
          {processing ? 'Feldolgozás…' : `Fizetés ${formatPrice(price)}`}
        </button>

        {message && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 6, backgroundColor: '#e7f7ea', color: '#065f2b' }}>
            {message}
          </div>
        )}

        <p style={{ marginTop: 12, color: '#666', fontSize: 12 }}>
          Demo: csak a tesztkártyaszám és CVV elfogadott. A kártyaadatok nem kerülnek tárolásra.
        </p>
      </div>
    </div>
  );
}