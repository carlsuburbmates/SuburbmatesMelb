# Multi-Region Suburb Rule — Featured Listings v2
> Canonical rule for suburbs that span multiple councils/regions.

## The Rule (One Line)
```
Multi-region suburbs → creator chooses region → locked for 30 days
```

## Affected Suburbs
| Suburb | Councils | Regions Available |
|---|---|---|
| Alphington | Darebin, Yarra | Northern, Inner City |
| Fairfield | Darebin, Yarra | Northern, Inner City |
| Flemington | Melbourne, Moonee Valley | Inner City, Western |

## Enforcement Logic
```sql
IF is_featured = true
AND current_date < feature_end_date
→ BLOCK region change
```

## DB Fields
```sql
selected_region_id    -- creator's chosen featured region
is_multi_region       -- boolean flag from CSV (true for 3 suburbs above)
feature_start_date    -- slot activation date
feature_end_date      -- slot expiry date (start + 30 days)
```

## UI States
- **Before activation (flagged suburb):** Region dropdown enabled. Show: "This suburb spans multiple regions. Select where you want to be featured."
- **During active slot:** Region dropdown disabled. Show: "Region locked until [date]"
- **After expiry + cooldown:** Region dropdown re-enabled. Creator can keep, switch, or not renew.
