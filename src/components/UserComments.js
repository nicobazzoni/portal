import React from "react";

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { floatButtonPrefixCls } from "antd/es/float-button/FloatButton";

import Avatar from 'react-avatar';

const UserComments = ({ name, body, createdAt, msg }) => {


  const svg = createAvatar(shapes, { seed: name });

//randominze shapes from dicebear SO EACH USER HAS A UNIQUE AVATAR
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="comments-list">
            <div className="media">
              {msg ? (
                <h4 className="mt-5">{msg}</h4>
              ) : (
                <>
                  <div className=" media-left p-2 mb-1  ">
                  <Avatar className="" name={name} size="50" round="25px" />
                  </div>
                  <div className="media-body">
                    <h3 className="text-start media-heading user_name">
                      {name} <small>{createdAt.toDate().toDateString()}</small>
                    </h3>
                    <p className="text-start">{body}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComments;