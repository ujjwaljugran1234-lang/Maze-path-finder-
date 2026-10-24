#include <stdio.h>

#define N 5

int main(void) {
    int maze[N][N];
    int visited[N][N] = {0};
    int parentR[N][N], parentC[N][N];
    int queueR[N * N], queueC[N * N];
    int front = 0, rear = 0;
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int r, c, i, found = 0;

    /* Read the 25 maze cells sent by the API. 0 = open, 1 = wall. */
    for (r = 0; r < N; r++) {
        for (c = 0; c < N; c++) {
            if (scanf("%d", &maze[r][c]) != 1) {
                printf("{\"path\":[]}");
                return 0;
            }
        }
    }

    /* Start and finish cannot be walls. */
    if (maze[0][0] == 1 || maze[N-1][N-1] == 1) {
        printf("{\"path\":[]}");
        return 0;
    }

    /* BFS: explore nearby cells first to find a shortest path. */
    queueR[rear] = 0;
    queueC[rear++] = 0;
    visited[0][0] = 1;
    parentR[0][0] = -1;
    parentC[0][0] = -1;

    while (front < rear) {
        r = queueR[front];
        c = queueC[front++];

        if (r == N - 1 && c == N - 1) {
            found = 1;
            break;
        }

        for (i = 0; i < 4; i++) {
            int nr = r + dr[i];
            int nc = c + dc[i];

            if (nr >= 0 && nr < N && nc >= 0 && nc < N &&
                maze[nr][nc] == 0 && !visited[nr][nc]) {
                visited[nr][nc] = 1;
                parentR[nr][nc] = r;
                parentC[nr][nc] = c;
                queueR[rear] = nr;
                queueC[rear++] = nc;
            }
        }
    }

    if (!found) {
        printf("{\"path\":[]}");
        return 0;
    }

    /* Rebuild the route backwards from finish to start. */
    {
        int pathR[N * N], pathC[N * N], length = 0;
        r = N - 1;
        c = N - 1;

        while (r != -1 && c != -1) {
            pathR[length] = r;
            pathC[length++] = c;
            {
                int pr = parentR[r][c];
                int pc = parentC[r][c];
                r = pr;
                c = pc;
            }
        }

        /* Return JSON coordinates in start-to-finish order. */
        printf("{\"path\":[");
        for (i = length - 1; i >= 0; i--) {
            printf("[%d,%d]%s", pathR[i], pathC[i], i ? "," : "");
        }
        printf("]}");
    }

    return 0;
}
