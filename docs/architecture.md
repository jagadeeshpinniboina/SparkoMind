# SparkoMind Platform Architecture & Specifications

## 1. System Topology

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  |   Kids View (6-12) |  | Adults View (13-59)|  |Seniors View (60+) |  |
|  +---------+----------+  +---------+----------+  +---------+---------+  |
|            |                       |                       |            |
|            +-----------------------+-----------------------+            |
|                                    |                                    |
|                       React 18 + Vite SPA Core                          |
|             (ThemeContext, AuthContext, GameEngine Mount)               |
|                                    |                                    |
|               Axios API Client (credentials: 'include')                 |
+------------------------------------+------------------------------------+
                                     |  HTTP REST (/api/v1)
                                     v
+-------------------------------------------------------------------------+
|                              BACKEND LAYER                              |
|                                                                         |
|                          Express.js Application                         |
|      [CORS Whitelist] -> [Cookie Parser] -> [JWT Auth Middleware]       |
|                                    |                                    |
|         +--------------------------+--------------------------+         |
|         |                          |                          |         |
|  auth.controller.js        game.controller.js      challenge.controller |
|         |                          |                          |         |
|         |                          |             +------------+----+    |
|         |                          |             | Zero-Trust Core |    |
|         |                          |             +-----------------+    |
|         |                          |             | gameValidator   |    |
|         |                          |             | xpEngine        |    |
|         v                          v             +------------+----+    |
|    User Model                  Game Model                     |         |
|         \                          |                         /          |
|          +-------------------------+------------------------+           |
|                                    |                                    |
|                         Mongoose ODM (MongoDB)                          |
+------------------------------------+------------------------------------+
                                     |
                                     v
                        MongoDB Document Store
         (Users, Games, Challenges, UserProgress, Attempts)
```

## 2. Zero-Trust Verification Workflow

1. **Client Requests Challenge:**  
   `GET /api/v1/challenges/:gameSlug/level/:level`  
   The Challenge Controller applies Mongoose projection to omit `solutionKey`:
   ```javascript
   Challenge.findOne({ ... }).select('-solutionKey');
   ```
2. **Client Renders Puzzle:**  
   The UI mounts the appropriate engine (`GridMatrixEngine`, etc.) and collects user action tokens (selected coordinates, order indices, decision choices).
3. **Attempt Submission:**  
   `POST /api/v1/challenges/:id/attempt` with payload:
   ```json
   {
     "submittedAnswer": [2, 5, 8],
     "timeTakenSeconds": 14.2
   }
   ```
4. **Backend Server-Side Validation:**  
   - `gameValidator.service.js` fetches the private `solutionKey` and runs deterministic comparison.
   - `xpEngine.service.js` calculates XP taking into account demographic multipliers, par-time speed bonuses, and player streaks.
   - `Attempt` is logged for auditability; `UserProgress` updates cumulatively.
   - Result is dispatched back to client without exposing the underlying puzzle solution vector.

## 3. Demographics Matrix

| Attribute | Kids (6–12) | Adults (13–59) | Seniors (60+) |
|---|---|---|---|
| **Theme Feel** | Playful, Gamified, High Brightness | High Density, Tech/Sleek, Minimalist | High Contrast, High Legibility, Calm |
| **Primary Color** | Sky/Electric Blue (`#2563EB`) | Deep Slate & Indigo (`#6366F1`) | Navy & Sage Green (`#059669`) |
| **Corner Radius** | `18px` – `24px` | `6px` – `8px` | `12px` |
| **Base Font Size**| `16px` | `15px` | `18px` – `20px` |
| **Touch/Click Target**| Large, bouncy | Compact, efficient | Minimum `48px` accessible |
| **Scoring Formula** | Star count, exploration bonus | Precise XP, Speed bonus, Accuracy % | Wellness streak, gentle progression |

## 4. Database Collections

- `users`: Credentials, demographics, settings.
- `games`: Game registry, meta description, category, engine association.
- `challenges`: Puzzles partitioned by level and target demographic, with private `solutionKey`.
- `user_progress`: Aggregated user XP, level, category breakdown, streaks.
- `attempts`: Historical immutable log of each gameplay session.
