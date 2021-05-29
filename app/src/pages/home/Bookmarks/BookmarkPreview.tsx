import { Box, Link, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { unfurlLink } from 'transport/unfurl';
import { LinkUnfurled } from 'types';
import useStyles from './styles';

interface Props {
  url: string;
}

export default function BookmarkPreview({ url }: Props) {
  const [preview, setPreview] = useState<LinkUnfurled | null>(null);
  const classes = useStyles();

  useEffect(() => {
    unfurlLink(url).then((metadata) => {
      setPreview(metadata);
    });
  }, [url]);

  return (
    <Box display="flex" padding={1}>
      <div className={classes.cardImageContainer}>
        {preview ? (
          <img
            src={preview?.image}
            alt={preview ? `${preview.title} banner` : ''}
            className={classes.cardImage}
          />
        ) : (
          <Skeleton variant="rect" animation="wave" width={100} height={100} />
        )}
      </div>
      <Box display="flex" flexDirection="column">
        {preview ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener"
            className={classes.cardLink}
          >
            {preview.title ?? '<No Title>'}
          </Link>
        ) : (
          <Skeleton
            variant="rect"
            animation="wave"
            width={300}
            height={20}
            style={{ marginBottom: '8px' }}
          />
        )}
        {preview ? (
          <Typography
            gutterBottom
            variant="caption"
            className={classes.textEllipsis}
          >
            {preview?.description}
          </Typography>
        ) : (
          <Skeleton
            variant="rect"
            animation="wave"
            width={500}
            height={40}
            style={{ marginBottom: '8px' }}
          />
        )}
        {preview ? (
          <Typography variant="caption" className={classes.textEllipsis}>
            {url}
          </Typography>
        ) : (
          <Skeleton variant="rect" animation="wave" width={250} height={20} />
        )}
      </Box>
    </Box>
  );
}
