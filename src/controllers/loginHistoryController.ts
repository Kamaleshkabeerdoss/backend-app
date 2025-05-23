import { Request, Response } from 'express';
import LoginHistory from '../models/LoginHistory';

export const getLoginHistory = async (req: Request, res: Response) => {
  try {
    // Get page number from query string, default to 1
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    // Fetch paginated results
    const result = await LoginHistory.query()
      .select('id','user_id', 'ip_address', 'login_time')
      .orderBy('login_time', 'desc')
      .page(page - 1, pageSize);

    // Format each record
    const formattedRecords = result.results.map(record => {
      const loginTimeIST = new Date(record.login_time).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });
      return {
        id : record.id,
        user_id: record.user_id,
        ip_address: record.ip_address,
        login_time: loginTimeIST,
      };
    });

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Login history fetched successfully',
      data: {
        total: result.total,   // total number of records
        page: page,
        pageSize: pageSize,
        records: formattedRecords
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      code: 500,
      message: 'Failed to fetch login history',
      data: null,
    });
  }
};




 





// import { Request, Response, NextFunction } from 'express';
// import LoginHistory from '../models/LoginHistory';

// export const getLoginHistory = async (req: Request, res: Response) => {
//   try {
//     console.log('Fetching login history...'); // DEBUG
//     const loginData = await LoginHistory.query().select('user_id', 'ip_address', 'login_time');
//     res.status(200).json({
//       status: 'success',
//       code: 200,
//       message: 'Login history fetched successfully',
//       data: loginData,
//     });
//   } catch (error) {
//         console.error(error); // DEBUG
//     res.status(500).json({
//       status: 'fail',
//       code: 500,
//       message: 'Failed to fetch login history',
//       data: null,
//     });
//   }
// };