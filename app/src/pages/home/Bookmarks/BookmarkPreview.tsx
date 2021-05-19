import { Box, Card, CardMedia, Link, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { unfurlLink } from 'transport/unfurl';
import { LinkUnfurled } from 'types';
import classNames from 'classnames';
import useStyles from './styles';
import { ArrowDropDown } from '@material-ui/icons';

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
        <img
          src={preview?.image}
          alt={preview ? `${preview.title} banner` : ''}
          className={classes.cardImage}
        />
      </div>
      <Box display="flex" flexDirection="column">
        <Link
          href={url}
          target="_blank"
          rel="noopener"
          className={classes.cardLink}
        >
          {preview?.title ? preview.title : 'a'}
        </Link>
        <Typography
          gutterBottom
          variant="caption"
          className={classes.textEllipsis}
        >
          {preview?.description}
        </Typography>
        <Typography variant="caption" className={classes.textEllipsis}>
          {url}
        </Typography>
      </Box>
    </Box>
  );
}
