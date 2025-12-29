# Featured Slot Checkout QA
- Timestamp: 2025-11-23T14:39:20.035Z
- Vendor Email: qa-featured-vendor@example.com
- Vendor ID: a46927e0-573e-4c04-ae29-d39fc5eb5d12
- Business Profile ID: a540388f-c015-4814-adce-544d0ce2d7c1
- Reserved Slot ID: 16050bb5-832e-4dc8-81dd-d6854603ab71
- Checkout Session ID: cs_mock_1763908759024
- Slot Status After Webhook: active

```json
{
  "timestamp": "2025-11-23T14:39:20.035Z",
  "vendorEmail": "qa-featured-vendor@example.com",
  "vendorId": "a46927e0-573e-4c04-ae29-d39fc5eb5d12",
  "businessProfileId": "a540388f-c015-4814-adce-544d0ce2d7c1",
  "lgaId": 17,
  "reservationResponse": {
    "success": true,
    "data": {
      "checkoutUrl": "http://localhost:3000/mock-featured-checkout",
      "sessionId": "cs_mock_1763908759024",
      "reservedSlotId": "16050bb5-832e-4dc8-81dd-d6854603ab71"
    }
  },
  "webhookResponse": {
    "received": true
  },
  "slotRecord": {
    "id": "16050bb5-832e-4dc8-81dd-d6854603ab71",
    "status": "active",
    "stripe_payment_intent_id": "pi_mock_1763908759085",
    "start_date": "2025-11-23T14:39:19.024+00:00",
    "end_date": "2025-12-23T14:39:19.024+00:00",
    "lga_id": 17
  }
}
```
