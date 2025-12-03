import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/reference/agencies', async () => {
    await delay(500);
    return HttpResponse.json([
      { id: "ist-alibeykoy", name: "İstanbul – Alibeyköy" },
      { id: "ist-bayrampasa", name: "İstanbul – Bayrampaşa" },
      { id: "ank-asti", name: "Ankara – AŞTİ" },
      { id: "bursa-otogar", name: "Bursa – Otogar" },
      { id: "izmir-otogar", name: "İzmir – Otogar" },
      { id: "antalya-otogar", name: "Antalya – Otogar" }
    ]);
  }),

  http.get('/api/schedules', async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const date = url.searchParams.get('date');

    if (!from || !to || !date) {
      return new HttpResponse(null, { status: 400, statusText: 'Missing parameters' });
    }

    const companies = ['Atlas Lines', 'Metro Express', 'Kamil Koç', 'Varan Turizm'];
    const mockTrips = Array.from({ length: 5 }).map((_, i) => {
      const hour = 8 + i * 2;
      const price = 650 + Math.floor(Math.random() * 150);
      const departureDate = new Date(date);
      departureDate.setHours(hour, i * 15, 0);
      const arrivalDate = new Date(departureDate);
      arrivalDate.setHours(arrivalDate.getHours() + 4, arrivalDate.getMinutes() + 45);
      
      return {
        id: `TRIP-${1001 + i}`,
        company: companies[i % companies.length],
        from: from,
        to: to,
        departure: departureDate.toISOString(),
        arrival: arrivalDate.toISOString(),
        price: price,
        availableSeats: Math.floor(Math.random() * 20) + 10,
      };
    });

    return HttpResponse.json(mockTrips);
  }),

  http.get('/api/seatSchemas/:tripId', async ({ params }) => {
    await delay(600);
    const { tripId } = params;
    
    const rows = 10;
    const cols = 5;
    const cells = [];
    const seats = [];
    let seatNo = 1;

    for (let r = 0; r < rows; r++) {
      const rowCells = [];
      for (let c = 0; c < cols; c++) {
        if (c === 2) {
          rowCells.push(2);
        } else {
          const isOccupied = Math.random() < 0.3;
          rowCells.push(isOccupied ? 1 : 0);
          
          seats.push({
            no: seatNo,
            row: r + 1,
            col: c + 1,
            status: isOccupied ? 'taken' : 'empty'
          });
          seatNo++;
        }
      }
      cells.push(rowCells);
    }

    return HttpResponse.json({
      tripId: tripId as string,
      layout: {
        rows,
        cols,
        cells
      },
      seats,
      unitPrice: 695
    });
  }),

  http.post('/api/tickets/sell', async () => {
    await delay(1500);
    
    const today = new Date();
    const pnr = `AT-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    return HttpResponse.json({
      ok: true,
      pnr: pnr,
      message: 'Payment step mocked.'
    });
  })
];
