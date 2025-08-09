import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    console.log(`Checking if user exists with email: ${email}`);

    // Create Supabase client using server-side helper
    const supabase = await createClient();

    // Results object to track where the user was found
    const results = {
      found: false,
      locations: {
        profiles: false,
        profile_users: false
      },
      userData: null
    };

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profiles table:', profileError);
    } else if (profileData) {
      console.log('User found in profiles table:', profileData);
      results.found = true;
      results.locations.profiles = true;
      results.userData = profileData;
    }

    // Check profile_users table
    try {
      const { data: profileUserData, error: profileUserError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (profileUserError) {
        console.error('Error checking profile_users table with email:', profileUserError);
      } else if (profileUserData) {
        console.log('User found in profile_users table:', profileUserData);
        results.found = true;
        results.locations.profile_users = true;

        if (!results.userData) {
          results.userData = profileUserData;
        }
      }
    } catch (profileUsersError) {
      console.error('Error processing profile_users table:', profileUsersError);
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Error checking user:', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    let
